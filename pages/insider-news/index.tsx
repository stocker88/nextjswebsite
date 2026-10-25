export {default} from '../../components/InsiderNewsArchive';
import {insiderArchiveProps} from '../../lib/insider-news-server';
export const getStaticProps=()=>insiderArchiveProps();
