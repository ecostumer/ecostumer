'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Overview } from './tabs/overview/index'
import Purchases from './tabs/tables'

export default function CreatePurchase() {
  // const { slug } = useParams<{ slug: string }>()

  // const { data } = useQuery({
  //   queryKey: [slug, 'products'],
  //   queryFn: () => getProducts({ slug }),
  // })

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="truncate text-3xl font-bold tracking-tight">Vendas</h2>

        {/* <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a
              href={`/api/videos/${clientId}/download/video`}
              target="_blank"
              rel="noreferrer"
            >
              <VideoIcon className="mr-2 h-4 w-4" />
              <span>Download MP4</span>
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`/api/videos/${clientId}/download/audio`}
              target="_blank"
              rel="noreferrer"
            >
              <Music2 className="mr-2 h-4 w-4" />
              <span>Download MP3</span>
            </a>
          </Button>
        </div> */}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Formulario</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="list">
          <Purchases />
        </TabsContent>
      </Tabs>
    </>
  )
}
