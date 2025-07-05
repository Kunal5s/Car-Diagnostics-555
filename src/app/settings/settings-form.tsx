'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function SettingsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Ready</CardTitle>
        <CardDescription>
          This application is fully configured and ready to use.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4 rounded-lg border bg-card p-4">
           <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0 mt-1" />
            <div>
                 <h3 className="font-semibold text-foreground">No API Keys Required</h3>
                 <p className="text-sm text-muted-foreground">
                  The article and image content for this application is pre-generated and built-in. You do not need to provide any API keys for the application to function.
                </p>
                 <p className="mt-2 text-sm text-muted-foreground">
                    You can start exploring the generated articles right away.
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
