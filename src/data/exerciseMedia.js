import images from './catalogImages';
export const imageSource=uri=>uri?.startsWith('catalog:')?images[uri.slice(8)]:{uri};
