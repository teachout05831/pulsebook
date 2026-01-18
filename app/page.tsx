import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-4">ServicePro</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Service business management platform
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduling</CardTitle>
              <CardDescription>
                Manage your team&apos;s schedule with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Drag-and-drop calendar, technician assignment, and route
                optimization.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Keep track of all your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Custom fields, service history, and communication logs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Get paid faster</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Invoicing, payment processing, and QuickBooks sync.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
