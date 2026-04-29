import { TouchableOpacity } from 'react-native'

import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

import { UsersProfileFollowActions } from './users-profile-follow-actions.component'

type UsersProfileTopBarProps = {
  userData: UserModel
  onOpenOptions: () => void
}

export const UsersProfileTopBar: React.FC<UsersProfileTopBarProps> = ({ userData, onOpenOptions }) => (
  <Box flexDirection="row" alignItems="center" justifyContent="space-between" pt={4} pl={5} pr={5}>
    <ThemedText variant="mono" size="lg" color="textPrimary">
      @{userData.username}
    </ThemedText>
    <Box flexDirection="row" alignItems="center" gap={3}>
      <UsersProfileFollowActions userData={userData} compact />
      <TouchableOpacity onPress={onOpenOptions}>
        <ThemedIcon name="Ellipsis" color="textPrimary" size={22} />
      </TouchableOpacity>
    </Box>
  </Box>
)
