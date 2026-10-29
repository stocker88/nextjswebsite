#!/usr/bin/env python3
"""Snapshot public course metadata. Run manually; never contacts YouTube at build time.
Fail closed on incomplete playlists or missing watch metadata: keep the previous catalog.
Only public, playable videos from the configured playlists are included.
"""
import concurrent.futures, datetime, json, pathlib, re, urllib.request, time
ROOT = pathlib.Path(__file__).resolve().parents[1]
CHANNEL = 'UCQU92dBvlCZMsnFHdDI9tSQ'
COURSES = [
 ('options-for-beginners','PLiBfVBTk2-F8r-7NsUrJ9Zjle_WIANUye'),
 ('stocks-for-beginners','PLiBfVBTk2-F8CJxMMXysCo1YIgBk3ROqq'),
 ('setups-and-signals','PLiBfVBTk2-F-Kui99Cekf7KqGMFVhmneH'),
]
def request(url, payload=None):
 data=None if payload is None else json.dumps(payload).encode()
 for attempt in range(3):
  try:
   req=urllib.request.Request(url,data=data,headers={'User-Agent':'Mozilla/5.0','Content-Type':'application/json','Accept-Language':'en-US,en;q=0.9'})
   return urllib.request.urlopen(req,timeout=30).read().decode()
  except Exception:
   if attempt==2: raise
   time.sleep(attempt+1)
def embedded(html, name):
 marker=re.search(r'(?:var )?'+name+r'\s*=\s*',html)
 if not marker: raise ValueError('Missing '+name)
 return json.JSONDecoder().raw_decode(html[marker.end():])[0]
def nodes(value):
 if isinstance(value,dict):
  yield value
  for child in value.values(): yield from nodes(child)
 elif isinstance(value,list):
  for child in value: yield from nodes(child)
def playlist(pid):
 html=request('https://www.youtube.com/playlist?list='+pid+'&hl=en')
 data=embedded(html,'ytInitialData'); ids=[]; page=data['contents']; seen=set()
 while True:
  for node in nodes(page):
   old=node.get('playlistVideoRenderer',{})
   new=node.get('lockupViewModel',{})
   vid=old.get('videoId') if old.get('isPlayable') else new.get('contentId')
   if vid and re.fullmatch(r'[\w-]{11}',vid) and vid not in ids: ids.append(vid)
  tokens=[n['continuationCommand']['token'] for item in nodes(page) if 'continuationItemRenderer' in item for n in nodes(item['continuationItemRenderer']) if n.get('continuationCommand',{}).get('token')]
  if not tokens: break
  token=tokens[-1]
  if token in seen: raise ValueError('Repeated pagination token')
  seen.add(token)
  version=re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"',html)
  if not version: raise ValueError('No continuation client')
  page=json.loads(request('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false',{'context':{'client':{'clientName':'WEB','clientVersion':version.group(1),'hl':'en'}},'continuation':token}))
  if not page.get('onResponseReceivedActions') and not page.get('onResponseReceivedEndpoints'): raise ValueError('Missing continuation results')
 if not ids: raise ValueError('Empty playlist '+pid)
 return ids

def video(vid):
 player=embedded(request('https://www.youtube.com/watch?v='+vid+'&hl=en'),'ytInitialPlayerResponse')
 details=player.get('videoDetails',{}); mf=player.get('microformat',{}).get('playerMicroformatRenderer',{})
 if details.get('videoId')!=vid or details.get('isPrivate') or details.get('channelId')!=CHANNEL: raise ValueError('Video unavailable or wrong channel: '+vid)
 date=mf.get('uploadDate') or mf.get('publishDate')
 if not date: raise ValueError('Missing actual publication date: '+vid)
 transcript=[]
 tracks=player.get('captions',{}).get('playerCaptionsTracklistRenderer',{}).get('captionTracks',[])
 english=next((t for t in tracks if t.get('languageCode')=='en'),None)
 if english:
  try:
   raw=json.loads(request(english['baseUrl']+'&fmt=json3'))
   transcript=[{'start':e.get('tStartMs',0)/1000,'text':''.join(s.get('utf8','') for s in e.get('segs',[])).strip()} for e in raw.get('events',[]) if e.get('segs')]
   transcript=[x for x in transcript if x['text']]
  except Exception: pass # Captions may not be publicly retrievable. Never invent them.
 return {'id':vid,'title':details['title'],'description':details.get('shortDescription',''),'publishedAt':date,'durationSeconds':int(details['lengthSeconds']),'thumbnail':'https://i.ytimg.com/vi/'+vid+'/hqdefault.jpg','transcript':transcript,'captionsAutomatic':bool(english and english.get('kind')=='asr')}

def main():
 course_ids={slug:playlist(pid) for slug,pid in COURSES}
 ids=list(dict.fromkeys(v for values in course_ids.values() for v in values))
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: videos=list(pool.map(video,ids))
 path=ROOT/'data/learning/catalog.json'
 if path.exists():
  old=json.loads(path.read_text())
  for c in old['courses']:
   if len(course_ids[c['slug']])<len(c['videoIds']): raise ValueError('Playlist shrank; review removals manually before replacing the snapshot')
 result={'updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'channelId':CHANNEL,'courses':[{'slug':slug,'playlistId':pid,'videoIds':course_ids[slug]} for slug,pid in COURSES],'videos':videos}
 temp=path.with_suffix('.tmp');temp.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');temp.replace(path)
 print('Saved',len(videos),'public lessons across',len(COURSES),'courses;',sum(bool(v['transcript']) for v in videos),'transcripts.')
if __name__=='__main__': main()
