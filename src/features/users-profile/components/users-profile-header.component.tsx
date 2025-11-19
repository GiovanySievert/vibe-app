import { Avatar, Box, Divider, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

type UsersProfileHeaderProps = {
  userData: UserModel
}

export const UsersProfileHeaderScreen: React.FC<UsersProfileHeaderProps> = ({ userData }) => {
  return (
    <>
      <Box flexDirection="row" justifyContent="space-around" alignItems="center" mt={3} mb={3}>
        <Box flexDirection="row" alignItems="center" gap={3}>
          <Avatar />
          <ThemedText variant="primary" weight="semibold" size="lg">
            {userData?.username}
          </ThemedText>
        </Box>

        <Box flexDirection="row" gap={3} mt={6}>
          <Box alignItems="center">
            <ThemedText variant="primary" weight="semibold">
              123
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Following
            </ThemedText>
          </Box>

          <Box alignItems="center">
            <ThemedText variant="primary" weight="semibold">
              1233
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Followers
            </ThemedText>
          </Box>
        </Box>
      </Box>

      <Divider />
    </>
  )
}
