import { Box, Input } from '@src/shared/components'

type SearchInputProps = {
  inputSearch: string
  setInputSearch: (value: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({ inputSearch, setInputSearch }) => {
  return (
    <Box>
      <Input
        value={inputSearch}
        onChange={({ nativeEvent }) => setInputSearch(nativeEvent.text)}
        autoFocus
        isClearable
        onClear={() => setInputSearch('')}
      />
    </Box>
  )
}
