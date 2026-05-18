import { Box, Input } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'

type SearchInputProps = {
  inputSearch: string
  setInputSearch: (value: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({ inputSearch, setInputSearch }) => {
  const { t } = useAppTranslation()

  return (
    <Box>
      <Input
        value={inputSearch}
        onChange={({ nativeEvent }) => setInputSearch(nativeEvent.text)}
        autoFocus
        isClearable
        onClear={() => setInputSearch('')}
        placeholder={t('search.input.placeholder')}
        startIconName="Search"
        startIconColor="textPrimary"
      />
    </Box>
  )
}
