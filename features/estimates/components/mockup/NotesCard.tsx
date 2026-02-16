'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { StickyNote, Lock, MessageSquare, Users, MessageCircle } from 'lucide-react'

export function NotesCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <StickyNote className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="internal">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="internal" className="gap-1.5">
              <Lock className="h-3 w-3" />
              Internal
            </TabsTrigger>
            <TabsTrigger value="customer" className="gap-1.5">
              <MessageSquare className="h-3 w-3" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="crew" className="gap-1.5">
              <Users className="h-3 w-3" />
              Crew Notes
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-1.5">
              <MessageCircle className="h-3 w-3" />
              Crew Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground italic">
                Visible to office only
              </p>
              <Textarea
                className="min-h-[140px] text-sm"
                defaultValue={`2 major street less than a mile\napartment to another apartment\n1st floor to a 2nd floor apartment\nno appliances boxes and furniture\n$150\n$125`}
              />
            </div>
          </TabsContent>

          <TabsContent value="customer">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground italic">
                Visible to the customer on their estimate page
              </p>
              <Textarea
                className="min-h-[140px] text-sm"
                defaultValue="Thank you for choosing us for your move! We'll handle everything with care. Please have all items boxed and ready by 8 AM on moving day."
              />
            </div>
          </TabsContent>

          <TabsContent value="crew">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground italic">
                Instructions visible to the assigned crew
              </p>
              <Textarea
                className="min-h-[140px] text-sm"
                defaultValue={`Bring extra blankets - customer has antique furniture\nNarrow staircase at pickup location\nStorage stop is quick - 10 boxes only\nDelivery has elevator - use freight entrance`}
              />
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground italic">
                Notes from crew after the job (read-only)
              </p>
              <div className="min-h-[140px] rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
                No crew feedback yet. Feedback will appear here once the crew completes the job.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
