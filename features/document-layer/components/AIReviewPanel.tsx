'use client';

import { useState } from 'react';
import { useAIReview } from '../hooks/useAIReview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, RefreshCw, Check, ExternalLink } from 'lucide-react';
import type { AIEstimateOutput } from '../types';

interface Props {
  consultationId: string;
  initialEstimate?: AIEstimateOutput | null;
  onAccepted?: (result: { estimateId: string; pageId: string | null }) => void;
}

export function AIReviewPanel({ consultationId, initialEstimate, onAccepted }: Props) {
  const review = useAIReview(consultationId);
  const [tab, setTab] = useState('estimate');
  const estimate = review.estimate || initialEstimate;

  const handleAccept = async () => {
    const result = await review.accept({ lineItems: estimate?.lineItems });
    if (result) onAccepted?.(result);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Review
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => review.generateEstimate()} disabled={review.isRegenerating}>
            <RefreshCw className={`h-4 w-4 mr-1 ${review.isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="estimate" className="flex-1">Estimate</TabsTrigger>
            <TabsTrigger value="page" className="flex-1">Page</TabsTrigger>
          </TabsList>

          <TabsContent value="estimate" className="mt-4 space-y-4">
            {!estimate ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                AI estimate will appear here after analysis
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Line Items</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-2">Description</th>
                          <th className="text-right p-2 w-16">Qty</th>
                          <th className="text-right p-2 w-24">Price</th>
                          <th className="text-right p-2 w-24">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estimate.lineItems.map((item, i) => (
                          <tr key={`${item.description}-${i}`} className="border-t">
                            <td className="p-2">{item.description}</td>
                            <td className="text-right p-2">{item.quantity}</td>
                            <td className="text-right p-2">${item.unitPrice.toFixed(2)}</td>
                            <td className="text-right p-2">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {estimate.resources && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Team Size</p>
                      <p className="font-medium">{estimate.resources.teamSize}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Est. Hours</p>
                      <p className="font-medium">{estimate.resources.estimatedHours}</p>
                    </div>
                  </div>
                )}

                {estimate.customerNotes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Customer Notes</h4>
                    <p className="text-sm text-muted-foreground">{estimate.customerNotes}</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="page" className="mt-4">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">
                AI-populated page content preview
              </p>
              <Button variant="outline" size="sm" onClick={() => review.generatePage()}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Generate Page Content
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {review.error && (
          <p className="text-sm text-destructive mt-3">{review.error}</p>
        )}

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button onClick={handleAccept} disabled={!estimate || review.isAccepting} className="flex-1">
            <Check className="h-4 w-4 mr-1" />
            {review.isAccepting ? 'Creating...' : 'Accept & Create Estimate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
