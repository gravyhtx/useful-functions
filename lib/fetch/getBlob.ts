export function getImageBlob(url: string) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP status: ${response.status}`);
    }
    return response.blob();
  });
}