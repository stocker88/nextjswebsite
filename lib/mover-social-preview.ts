import type {MoverArticle} from './mover-research';

export const moverSocialImagePath=(article:Pick<MoverArticle,'slug'|'updatedAt'>)=>{
 const version=Number.isFinite(Date.parse(article.updatedAt))?Date.parse(article.updatedAt).toString(36):'1';
 return `/assets/social/movers/${article.slug}-${version}-v2.png`;
};
