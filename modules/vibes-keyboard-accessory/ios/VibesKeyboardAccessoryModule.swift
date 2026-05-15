import ExpoModulesCore
import UIKit

public class VibesKeyboardAccessoryModule: Module {
  public func definition() -> ModuleDefinition {
    Name("VibesKeyboardAccessory")

    AsyncFunction("setEnabled") { (enabled: Bool) in
      VibesKeyboardAccessoryController.shared.setEnabled(enabled)
    }
    .runOnQueue(.main)
  }
}

private final class VibesKeyboardAccessoryController {
  static let shared = VibesKeyboardAccessoryController()

  private var isEnabled = false
  private var isObserving = false
  private weak var currentResponder: UIResponder?
  private var isHiddenForCurrentFocus = false

  private lazy var accessoryView: UIView = {
    let container = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: 44))
    container.backgroundColor = .clear
    container.autoresizingMask = [.flexibleWidth]

    let button = UIButton(type: .system)
    button.translatesAutoresizingMaskIntoConstraints = false
    button.setImage(UIImage(systemName: "chevron.down"), for: .normal)
    button.tintColor = UIColor(red: 0.07, green: 0.07, blue: 0.07, alpha: 1)
    button.backgroundColor = UIColor(red: 0.44, green: 0.91, blue: 0.66, alpha: 1)
    button.layer.cornerRadius = 18
    button.accessibilityLabel = "Hide keyboard accessory"
    button.addTarget(self, action: #selector(hideForCurrentFocus), for: .touchUpInside)

    container.addSubview(button)

    NSLayoutConstraint.activate([
      button.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -16),
      button.topAnchor.constraint(equalTo: container.topAnchor, constant: 4),
      button.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -4),
      button.widthAnchor.constraint(equalToConstant: 48)
    ])

    return container
  }()

  func setEnabled(_ enabled: Bool) {
    guard isEnabled != enabled else {
      return
    }

    isEnabled = enabled

    if enabled {
      install()
    } else {
      uninstall()
    }
  }

  private func install() {
    guard !isObserving else {
      attachToCurrentResponderIfNeeded()
      return
    }

    isObserving = true
    NotificationCenter.default.addObserver(self, selector: #selector(didBeginEditing), name: UITextField.textDidBeginEditingNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(didBeginEditing), name: UITextView.textDidBeginEditingNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(didEndEditing), name: UITextField.textDidEndEditingNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(didEndEditing), name: UITextView.textDidEndEditingNotification, object: nil)
    attachToCurrentResponderIfNeeded()
  }

  private func uninstall() {
    if isObserving {
      NotificationCenter.default.removeObserver(self)
      isObserving = false
    }

    if let currentResponder {
      detach(from: currentResponder)
    }

    currentResponder = nil
    isHiddenForCurrentFocus = false
  }

  private func attachToCurrentResponderIfNeeded() {
    guard let responder = UIResponder.vibesCurrentFirstResponder() else {
      return
    }

    currentResponder = responder
    isHiddenForCurrentFocus = false
    attach(to: responder)
  }

  @objc private func didBeginEditing(_ notification: Notification) {
    guard isEnabled, let responder = notification.object as? UIResponder else {
      return
    }

    currentResponder = responder
    isHiddenForCurrentFocus = false
    attach(to: responder)
  }

  @objc private func didEndEditing(_ notification: Notification) {
    guard let responder = notification.object as? UIResponder, responder === currentResponder else {
      return
    }

    detach(from: responder)
    currentResponder = nil
    isHiddenForCurrentFocus = false
  }

  @objc private func hideForCurrentFocus() {
    guard let currentResponder else {
      return
    }

    isHiddenForCurrentFocus = true
    detach(from: currentResponder)
    currentResponder.resignFirstResponder()
  }

  private func attach(to responder: UIResponder) {
    guard !isHiddenForCurrentFocus else {
      return
    }

    if let textField = responder as? UITextField {
      textField.inputAccessoryView = accessoryView
      textField.reloadInputViews()
    } else if let textView = responder as? UITextView {
      textView.inputAccessoryView = accessoryView
      textView.reloadInputViews()
    }
  }

  private func detach(from responder: UIResponder) {
    if let textField = responder as? UITextField, textField.inputAccessoryView === accessoryView {
      textField.inputAccessoryView = nil
      textField.reloadInputViews()
    } else if let textView = responder as? UITextView, textView.inputAccessoryView === accessoryView {
      textView.inputAccessoryView = nil
      textView.reloadInputViews()
    }
  }
}

private final class VibesFirstResponderLookup {
  static let shared = VibesFirstResponderLookup()
  weak var responder: UIResponder?
}

private extension UIResponder {
  static func vibesCurrentFirstResponder() -> UIResponder? {
    VibesFirstResponderLookup.shared.responder = nil
    UIApplication.shared.sendAction(#selector(vibesCaptureFirstResponder), to: nil, from: nil, for: nil)
    return VibesFirstResponderLookup.shared.responder
  }

  @objc func vibesCaptureFirstResponder() {
    VibesFirstResponderLookup.shared.responder = self
  }
}
