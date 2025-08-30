import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-utensils text-primary-foreground text-sm"></i>
              </div>
              <h1 className="text-xl font-bold">BITS Eats</h1>
            </div>
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-login"
            >
              Login with BITS Email
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Campus Food Delivery
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Order from your favorite BITS Goa campus eateries. Fast delivery, fresh food, happy students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-4 py-2">
                <i className="fas fa-clock text-primary"></i>
                <span className="text-sm">15-30 min delivery</span>
              </div>
              <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-4 py-2">
                <i className="fas fa-map-marker-alt text-primary"></i>
                <span className="text-sm">BITS Goa Campus Only</span>
              </div>
              <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-4 py-2">
                <i className="fas fa-shield-alt text-primary"></i>
                <span className="text-sm">Secure Payments</span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BITS Eats?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-clock text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick delivery across campus. Most orders delivered within 15-30 minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-store text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Campus Vendors</h3>
                <p className="text-muted-foreground">
                  All your favorite campus eateries in one place. From canteen to cafés.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-mobile-alt text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
                <p className="text-muted-foreground">
                  Simple, intuitive interface. Order with just a few taps.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-utensils text-primary-foreground text-xs"></i>
              </div>
              <span className="font-semibold">BITS Eats</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 BITS Eats. Made for BITS Goa students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
