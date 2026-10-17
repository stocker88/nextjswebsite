import type {NextApiRequest,NextApiResponse} from 'next';
import {loadHeatmap} from '../../lib/market-heatmap-server';
export default async function handler(req:NextApiRequest,res:NextApiResponse){if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=60');return res.status(200).json(await loadHeatmap());}
