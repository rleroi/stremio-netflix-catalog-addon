import axios from 'axios';
import { decode } from 'html-entities'

//const COUNTRY = 67; // NL
//const COUNTRY = 78; // US
const COUNTRY = 46; // UK
const MAX = 300;
const DAYS = 300;

export default {
    async getMetas(type = 'movie') {
        let metas = [];
        let offset = 0;
        const limit = 50;

        do {
            metas = [...metas, ...(await axios.get(`https://unogs.com/api/search?query=new%20last%20${DAYS}%20days&orderby=-Date&countrylist=${COUNTRY}&type=${type}&limit=${limit}&offset=${offset}`, {
                headers: {
                    'REFERRER': 'http://unogs.com',
                    'Referer': 'https://unogs.com/countrydetail',
                },
            }).catch(console.error))?.data?.results?.map(item => {
                return {
                    id: item.imdbid,
                    name: decode(item.title),
                    poster: item.img,
                    description: decode(item.synopsis),
                    year: item.year,
                    posterShape: 'poster',
                    type: item.vtype,
                }
            }).filter(item => !!item.id)];
        } while((offset += limit) < MAX);

        return metas;
    }
}

