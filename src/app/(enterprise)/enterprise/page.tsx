import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, TrendingUp, Lock } from "lucide-react";

export default function EnterprisePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Enterprise Solutions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Collect high-quality egocentric video data at scale with our crowdsourced platform
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Dataset */}
        <Link href="/enterprise/new">
          <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <PlusCircle className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <Badge>Active</Badge>
              </div>
              <CardTitle>Create Private Dataset</CardTitle>
              <CardDescription>
                Post a bounty to collect custom egocentric video data for your specific use case
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Validate videos with AI pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Quality scoring & rubric</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Custom acceptance criteria</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Full licensing control</span>
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Invest */}
        <Card className="h-full opacity-60">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <Badge variant="secondary">
                <Lock className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
            <CardTitle>Invest in Platform</CardTitle>
            <CardDescription>
              Participate in platform governance and revenue sharing opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Platform token allocation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Governance voting rights</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Revenue sharing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Early access to features</span>
              </li>
            </ul>
            <Button className="w-full" size="lg" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose POV Bounties?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-2">AI-Powered Validation</h4>
            <p className="text-sm text-muted-foreground">
              6-stage validation pipeline ensures high-quality data: domain check, scene parsing, VLM classification, supervisory verification, LLM mapping, and quality scoring
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Global Community</h4>
            <p className="text-sm text-muted-foreground">
              Access thousands of contributors ready to capture authentic first-person experiences across diverse scenarios and locations
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Flexible Licensing</h4>
            <p className="text-sm text-muted-foreground">
              Choose from commercial, research, or custom licensing options to fit your specific data usage requirements
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

