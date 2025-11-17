import { Avatar, Box, Divider, ThemedText } from '@src/shared/components'

type SearchResultItemProps = {
  data: any
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ data }) => {
  return (
    <>
      <Box flexDirection="row" alignItems="center" gap={3}>
        <Avatar
          size="sm"
          uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkB5zkX3mrbLiQ_WjvF-rWwWQJEJ3wK3oB-Q&s"
        />
        <Box>
          <ThemedText>{data.name}</ThemedText>
          <ThemedText color="textSecondary" size="sm">
            Bar
          </ThemedText>
        </Box>
      </Box>
      <Divider />
    </>
  )
}
