const convertHtmlToText = (html: string): string => {
  try {
    return html.replace(/<[^>]+>|&nbsp;/gi, '').trim();
  } catch (error) {
    return '';
  }
};

export default convertHtmlToText;
