exports.getOriginalImages = (image) => {
return image.replace(/([0-9]+x[0-9]+)|w[0-9]+/,'w1200');
};

exports.getImageBySize = (image,size) => {
    return image.replace(/([0-9]+x[0-9]+)|w[0-9]+/,size +'x'+size);
};