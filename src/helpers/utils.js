

export const truncateText = (text, numWords =20 ) => {
    const words = text.split(' ');
    if (words.length <= numWords) {
        return text;
    } else {
       const truncatedWords = words.slice(0, numWords);
       const truncatedText = truncatedWords.join(' ');
         return truncatedText + '...';

    }
};