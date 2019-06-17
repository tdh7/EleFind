exports.getOriginalImages = (image) => {
return image.replace(/([0-9]+x[0-9]+)|w[0-9]+/,'w1200');
};
function format(x) {
    return  x.toLocaleString('it-IT', {style: 'currency', currency: 'VND'});
}

exports.getImageBySize = (image,size) => {
    return image.replace(/([0-9]+x[0-9]+)|w[0-9]+/,size +'x'+size);
};
exports.paginate  = (array, page_size, page_number) => {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}