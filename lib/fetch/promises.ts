export const promiseAny = (urlArr: Promise<any>[]) => {
  Promise.any(urlArr)
    .then((data) => {
      let objectURL = URL.createObjectURL(data);
      return objectURL;
    })
    .catch((e) => {
      console.log(e.message);
    });
}
// let cat = getImageBlob('https://upload.wikimedia.org/wikipedia/commons/4/43/Siberian_black_tabby_blotched_cat_03.jpg');
// let dog = getImageBlob('https://upload.wikimedia.org/wikipedia/commons/a/af/Golden_retriever_eating_pigs_foot.jpg');
// console.log(promiseAny([cat, dog]))
