import { Box, Button, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

type UsersProfileFollowActionsProps = {
  userData: UserModel
}

export const UsersProfileFollowActions: React.FC<UsersProfileFollowActionsProps> = ({ userData }) => {
  return (
    <Box pr={5} pl={5} mt={3}>
      <Button>
        <ThemedText weight="semibold" size="lg">
          Follow
        </ThemedText>
      </Button>
    </Box>
  )
}
