## elasticlunr.js (included in mdbook output by default)

- implements indexing and searching for English text
- index
    1. tokenizer: splits the text into tokens (i.e. words)
    1. pipeline: For each token:
        - trimmer: removes prefix/suffix non-word characters `token.replace(/^\W+/, '').replace(/\W+$/, '')` (which removes any Japanese characters)
        - stopWordFilter: remove common and non-meaningful words like "a", "we"
        - stemmer: removes inflection e.g. both "applies" and "apply" become "appli"
    1. builds a prefix tree of the tokens
- search
    - applies the same process to the search query, and search the page that contains all/any of the resulting tokens (depending on the `use-boolean-and` option in book.toml)

## Plugins from https://github.com/weixsong/lunr-languages 

### lunr.jp.js

- provides stopWordFilter, stemmer for Japanese
- implements a custom tokenizer (which is unusual)

### tinyseg.js

- used by lunr.jp.js
- segments Japanese text

### lunr.multi.js

- add support for multiple languages
- combines pipeline functions from all specified languages, as well as constructs a new trimmer based on each lang's `wordCharacters` (which lunr.jp.js doesn't have, so we added it)

### lunr.stemmer.support.js

- provides `trimmerSupport` and `stemmerSupport` functions
- `trimmerSupport` is used by lunr.multi.js
