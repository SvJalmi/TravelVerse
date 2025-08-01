import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { UserInteractionProvider } from '@/providers/UserInteractionProvider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';

// Pages
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import Destination from '@/pages/Destination';
import PhotoGuides from '@/pages/PhotoGuides';
import AIPlanner from '@/pages/AIPlanner';
import VRExperience from '@/pages/VRExperience';
import ARView from '@/pages/ARView';
import Analytics from '@/pages/Analytics';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserInteractionProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            
            {/* Main content with proper spacing for fixed navbar */}
            <main className="pt-16">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/explore" component={Explore} />
                <Route path="/destination/:id" component={Destination} />
                <Route path="/photo-guides" component={PhotoGuides} />
                <Route path="/photo-guides/:destinationId" component={PhotoGuides} />
                <Route path="/ai-planner" component={AIPlanner} />
                <Route path="/vr/:destinationId" component={VRExperience} />
                <Route path="/vr" component={VRExperience} />
                <Route path="/ar/:destinationId" component={ARView} />
                <Route path="/ar" component={ARView} />
                <Route path="/analytics" component={Analytics} />
                <Route component={NotFound} />
              </Switch>
            </main>
            
            <Toaster />
          </div>
        </UserInteractionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}