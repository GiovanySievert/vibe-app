import { Avatar, Box, Card, ThemedText } from '@src/shared/components'

export const UserMenuHeader = () => {
  return (
    <Card bg="background" gap={4}>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" gap={4}>
          <Avatar size="sm" />
          <Box>
            <ThemedText variant="primary" size="lg" weight="semibold">
              Giovany Sievert
            </ThemedText>

            <ThemedText variant="secondary" size="sm">
              giovanysievert@gmail.com
            </ThemedText>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
