"""Import the user-supplied DOCX, preserving paragraph/image/hyperlink order."""
import sys,zipfile,re,json,io
from pathlib import Path
from PIL import Image
from xml.etree import ElementTree as E
p=Path(sys.argv[1]); root=Path(__file__).resolve().parents[1]
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
groups={'الصدر | Chest':'chest','الترايسبس | Triceps':'triceps','السمانة | Calves':'calves','الظهر | Back':'back','البايسبس | Biceps':'biceps','البطن | Abdominals':'core','الأكتاف | Shoulders':'shoulders','الأرجل | Legs':'legs'}
rows=[];current=None;group=None;assets={};media={};out=root/'assets/exercises';out.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(p) as z:
 rels={r.attrib['Id']:r.attrib for r in E.fromstring(z.read('word/_rels/document.xml.rels'))}
 for para in E.fromstring(z.read('word/document.xml')).findall('.//w:body/w:p',ns):
  text=''.join(t.text or '' for t in para.findall('.//w:t',ns)).strip()
  if text in groups:group=groups[text];current=None;continue
  if group and re.match(r'^\d+\. ',text):
   current={'id':'guide-%03d'%(len(rows)+1),'name_ar':re.sub(r'^\d+\. ','',text),'primary_muscle':group,'instructions':'','source_url':''};rows.append(current);continue
  if not current:continue
  if text.startswith(('وضع البداية:','الحركة:','تنبيه','ملاحظة')):current['instructions']+=('\n\n' if current['instructions'] else '')+text
  elif text and not current.get('name') and not text.startswith(('الصورة:','صفحة')):current['name']=text
  for link in para.findall('.//w:hyperlink',ns):
   rid=link.get('{'+ns['r']+'}id');target=rels.get(rid,{}).get('Target','')
   if target.startswith('http'):current['source_url']=target
  for blip in para.findall('.//a:blip',ns):
   rid=blip.get('{'+ns['r']+'}embed');target=rels[rid]['Target'];filename=Path(target).stem+'.jpg'
   if target not in media:
    im=Image.open(io.BytesIO(z.read('word/'+target))).convert('RGB');im.thumbnail((1080,1080));im.save(out/filename,quality=85);media[target]=filename
   assets[current['id']]=media[target]
assert len(rows)==143 and len(assets)==143
for e in rows:
 name=e['name'].lower();e['equipment']=next((gear for key,gear in [('cable','cable'),('pulldown','cable'),('pressdown','cable'),('dumbbell','dumbbell'),('barbell','barbell'),('ez bar','barbell'),('trap bar','barbell'),('machine','machine'),('smith','machine'),('leg press','machine'),('pec deck','machine')] if key in name),'bodyweight' if any(x in name for x in ['push up','pull up','crunch','sit up','raise','plank']) else 'other')
 e['tracking_type']='duration' if 'plank' in name else 'bodyweight_reps' if e['equipment']=='bodyweight' else 'weight_reps'
 # Explicit equipment corrections from the Arabic start-position descriptions.
 gearOverrides={13:'barbell',17:'barbell',18:'dumbbell',24:'bodyweight',25:'bodyweight',26:'machine',27:'machine',36:'barbell',56:'dumbbell',80:'dumbbell',91:'cable',93:'barbell',95:'machine',96:'dumbbell',97:'machine',98:'machine',99:'machine',100:'machine',101:'barbell',105:'bodyweight',106:'bodyweight',107:'bodyweight',108:'bodyweight',111:'bodyweight',112:'band',113:'bodyweight',114:'bodyweight',116:'bodyweight',117:'kettlebell',118:'barbell',119:'bodyweight',120:'bodyweight',121:'band',122:'bodyweight',123:'bodyweight',124:'bodyweight',125:'bodyweight',128:'band',131:'bodyweight',133:'band',137:'band',139:'kettlebell',141:'bodyweight',143:'bodyweight'}
 e['equipment']=gearOverrides.get(int(e['id'].split('-')[1]),e['equipment'])
 e['tracking_type']='duration' if any(x in name for x in ['plank','wall sit']) else 'bodyweight_reps' if e['equipment']=='bodyweight' else 'weight_reps'
 e['image_uri']='catalog:'+e['id']
(root/'src/data/exerciseGuide.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
(root/'src/data/catalogImages.js').write_text('export default {\n'+''.join(" '%s':require('../../assets/exercises/%s'),\n"%(k,v) for k,v in assets.items())+'};\n')
print('Imported',len(rows),'exercises;',len(media),'unique images;',sum(x.stat().st_size for x in out.iterdir()),'image bytes')
