import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Send,
  Hash,
  MapPin,
  Clock,
  Wand2,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';

interface GeneratedContent {
  type: 'caption' | 'hashtags' | 'hook' | 'description';
  content: string;
  timestamp: Date;
}

interface AIContentGeneratorProps {
  onGenerate?: (content: any) => void;
  onClose?: () => void;
}

export function AIContentGenerator({ onGenerate, onClose }: AIContentGeneratorProps) {
  const [activeTab, setActiveTab] = useState('caption');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);

  const [contentTemplates] = useState([
    {
      id: 'news',
      title: 'Yangilik',
      description: 'Shahar yangiliklari uchun',
      prompt: 'Navoiy shahrida sodir bo\'lgan yangilik haqida post yozing'
    },
    {
      id: 'business',
      title: 'Biznes',
      description: 'Tadbirkorlik imkoniyatlari',
      prompt: 'Navoiyda yangi biznes imkoniyatlari haqida post'
    },
    {
      id: 'tourism',
      title: 'Turizm',
      description: 'Shahar diqqatga sazovor joylari',
      prompt: 'Navoiy shahridagi tarixiy joylar haqida'
    },
    {
      id: 'culture',
      title: 'Madaniyat',
      description: 'Madaniy tadbirlar',
      prompt: 'Navoiyda bo\'lib o\'tadigan madaniy tadbirlar'
    }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // AI simulatsiyasi - haqiqiy AI integratsiyasi qo'shiladi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedTexts = {
      caption: [
        `🌟 ${prompt}\n\nNavoiyda yangi imkoniyatlar har kuni paydo bo'lmoqda! Bizning shahrimiz rivojlanib, tinmay oldinga intilmoqda.\n\n#NavoiydaBugun #Rivojlanish #YangiImkoniyat`,
        `📢 Diqqat! ${prompt}\n\nBu ajoyib yangilik shahrimiz aholisi uchun katta ahamiyatga ega. Batafsil ma'lumot uchun rasmiy sahifalarimizni kuzatib boring.\n\n#MuhimYangilik #NavoiyAholi #RasmiyMa'lumot`,
        `✨ ${prompt}\n\nHar bir qadam oldinga - bu bizning maqsadimiz! Navoiy shahri yanada go'zal va zamonaviy bo'lishda davom etmoqda.\n\n#Maqsad #Zamonaviy #GozelShahar`
      ],
      hashtags: [
        '#NavoiydaBugun #Navoiy #Uzbekistan #Shahar #Yangilik #Rivojlanish #Imkoniyat #Kelajak #Muvaffaqiyat #Progress',
        '#NavoiyLife #UzbekistanToday #CityNews #Development #Opportunity #Success #ModernCity #Innovation #Growth #Future',
        '#НавоиСегодня #Навои #Узбекистан #Развитие #Возможности #Успех #СовременныйГород #Прогресс #Будущее #Новости'
      ],
      hook: [
        '🔥 Navoiyda yangi era boshlanmoqda!',
        '⚡ Siz buni ko\'rishingiz kerak!',
        '🚀 Ajoyib yangilik keldi!',
        '💫 Bu haqiqatan ham hayratlanarli!',
        '🌟 Sizni hayratda qoldiradigan yangilik!'
      ],
      description: [
        `Bu post ${prompt.toLowerCase()} haqida batafsil ma'lumot beradi. Shahrimizda sodir bo'layotgan ijobiy o'zgarishlar haqida muntazam xabar berib turamiz.`,
        `${prompt} - bu bizning shahrimiz uchun muhim voqea. Barcha tafsilotlar bilan tanishib, o'z fikrlaringizni yozib qoldiring.`,
        `Navoiy shahrida ${prompt.toLowerCase()} jarayoni davom etmoqda. Bu bizning birgalikdagi sa'y-harakatlarimizning natijasidir.`
      ]
    };

    const newContent: GeneratedContent = {
      type: activeTab as any,
      content: generatedTexts[activeTab as keyof typeof generatedTexts][
        Math.floor(Math.random() * generatedTexts[activeTab as keyof typeof generatedTexts].length)
      ],
      timestamp: new Date()
    };

    setGeneratedContent(prev => [newContent, ...prev]);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification qo'shish mumkin
  };

  const applyTemplate = (template: any) => {
    setPrompt(template.prompt);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2>AI Kontent Generator</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      {/* Sozlamalar */}
      <Card className="p-4">
        <h3 className="mb-4">Kontent sozlamalari</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Kontent turi</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Turni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Instagram Post</SelectItem>
                  <SelectItem value="reel">Reels Video</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ohang</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Ohangni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Do'stona</SelectItem>
                  <SelectItem value="excited">Jo'shqin</SelectItem>
                  <SelectItem value="informative">Ma'lumotli</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Mavzu yoki g'oya</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Qanday kontent yaratmoqchisiz? Masalan: 'Navoiy shahrida yangi park ochilishi'"
              className="min-h-[80px]"
            />
          </div>
        </div>
      </Card>

      {/* Tez shablonlar */}
      <div>
        <h3 className="mb-3">Tez shablonlar</h3>
        <div className="grid grid-cols-2 gap-2">
          {contentTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              onClick={() => applyTemplate(template)}
              className="h-auto p-3 flex flex-col items-start text-left"
            >
              <div className="font-medium text-sm">{template.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {template.description}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button 
        onClick={handleGenerate} 
        disabled={!prompt.trim() || isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Yaratilmoqda...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Kontent yaratish
          </>
        )}
      </Button>

      {/* Tabs for different content types */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="caption">Caption</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="hook">Hook</TabsTrigger>
          <TabsTrigger value="description">Tavsif</TabsTrigger>
        </TabsList>

        <TabsContent value="caption" className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Send className="w-4 h-4" />
            <span className="font-medium">Caption matnlari</span>
          </div>
          {generatedContent
            .filter(item => item.type === 'caption')
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.timestamp.toLocaleTimeString('uz-UZ', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    Tahrirlash
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => onGenerate?.(item)}>
                    Ishlatish
                  </Button>
                </div>
              </motion.div>
            ))}
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4" />
            <span className="font-medium">Hashtag to'plamlari</span>
          </div>
          {generatedContent
            .filter(item => item.type === 'hashtags')
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.timestamp.toLocaleTimeString('uz-UZ', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.content.split(' ').map((hashtag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    Tahrirlash
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => onGenerate?.(item)}>
                    Ishlatish
                  </Button>
                </div>
              </motion.div>
            ))}
        </TabsContent>

        <TabsContent value="hook" className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4" />
            <span className="font-medium">Diqqat jalb qiluvchi Hook</span>
          </div>
          {generatedContent
            .filter(item => item.type === 'hook')
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.timestamp.toLocaleTimeString('uz-UZ', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-lg font-medium text-center py-4">
                  {item.content}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    Tahrirlash
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => onGenerate?.(item)}>
                    Ishlatish
                  </Button>
                </div>
              </motion.div>
            ))}
        </TabsContent>

        <TabsContent value="description" className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" />
            <span className="font-medium">Post tavsiflari</span>
          </div>
          {generatedContent
            .filter(item => item.type === 'description')
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.timestamp.toLocaleTimeString('uz-UZ', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed">
                  {item.content}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    Tahrirlash
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => onGenerate?.(item)}>
                    Ishlatish
                  </Button>
                </div>
              </motion.div>
            ))}
        </TabsContent>
      </Tabs>

      {/* Pro tip */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">Pro maslahat</h4>
            <p className="text-xs text-muted-foreground">
              Eng yaxshi natijalar uchun aniq va batafsil prompt yozing. 
              Maqsadli auditoriya, kontent maqsadi va asosiy xabarni belgilang.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}