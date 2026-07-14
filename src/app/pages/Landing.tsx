import { useNavigate } from 'react-router';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Users,
  Brain,
  Calendar,
  BarChart3,
  FileText,
  Check,
  ArrowRight,
  Star,
  Shield,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const features = [
  {
    icon: Building2,
    title: 'Organization Management',
    description: 'Complete control over your institute, teachers, students, and operations',
    color: 'text-primary',
  },
  {
    icon: BookOpen,
    title: 'Teacher Dashboard',
    description: 'Streamlined class management, assignments, and student tracking',
    color: 'text-success',
  },
  {
    icon: Brain,
    title: 'AI-Powered Tutor',
    description: '24/7 intelligent tutoring system for personalized student learning',
    color: 'text-warning',
  },
  {
    icon: Users,
    title: 'Parent Portal',
    description: 'Real-time visibility into child\'s progress, attendance, and performance',
    color: 'text-secondary',
  },
  {
    icon: FileText,
    title: 'Assignments & Tests',
    description: 'Create, assign, and auto-grade with AI-powered quiz generation',
    color: 'text-primary',
  },
  {
    icon: Calendar,
    title: 'Attendance Tracking',
    description: 'Automated attendance management with parent notifications',
    color: 'text-success',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Comprehensive insights into student progress and weak areas',
    color: 'text-warning',
  },
  {
    icon: Zap,
    title: 'AI Quiz Generator',
    description: 'Generate customized quizzes in seconds based on curriculum',
    color: 'text-secondary',
  },
];

const roles = [
  {
    title: 'For Org Admins',
    description: 'Manage your entire institute from one powerful dashboard',
    features: ['Multi-branch management', 'Teacher & student onboarding', 'Subscription & billing', 'Comprehensive reports'],
    icon: Building2,
  },
  {
    title: 'For Teachers',
    description: 'Focus on teaching while we handle the administrative work',
    features: ['Class management', 'Assignment creation', 'AI-powered grading', 'Parent communication'],
    icon: BookOpen,
  },
  {
    title: 'For Students',
    description: 'Your personal learning companion with AI support',
    features: ['Course access', '24/7 AI tutor', 'Progress tracking', 'Interactive quizzes'],
    icon: GraduationCap,
  },
  {
    title: 'For Parents',
    description: 'Stay connected with your child\'s learning journey',
    features: ['Real-time progress', 'Attendance alerts', 'Teacher messages', 'Fee management'],
    icon: Users,
  },
];

const testimonials = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Principal, Greenwood Academy',
    content: 'Ascentia transformed how we manage our institute. The AI tutor alone has improved student engagement by 40%.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Mathematics Teacher',
    content: 'The assignment grading and quiz generation features save me hours every week. I can focus more on actual teaching.',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    role: 'Parent',
    content: 'I love how I can monitor my daughter\'s progress in real-time. The parent portal keeps me informed without being intrusive.',
    rating: 5,
  },
];

const pricing = [
  {
    name: 'Starter',
    price: '₹999',
    period: 'per month',
    features: ['Up to 100 students', 'Basic analytics', 'AI tutor (limited)', 'Email support'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: '₹2,499',
    period: 'per month',
    popular: true,
    features: ['Up to 500 students', 'Advanced analytics', 'Unlimited AI tutor', 'Priority support', 'Custom branding'],
    cta: 'Book Demo',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    features: ['Unlimited students', 'Multi-branch support', 'Dedicated AI capacity', '24/7 support', 'Custom integrations'],
    cta: 'Contact Sales',
  },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-semibold">Ascentia</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/login')}>
                Book Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6">
              AI-Powered Learning Management
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Powered LMS for Modern Schools & Coaching Institutes
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Complete institute management with intelligent tutoring, automated workflows, and real-time insights for teachers, students, and parents
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')}>
                Book Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                View Platform
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Manage Learning</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for schools, coaching institutes, and learning organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`p-3 rounded-lg bg-accent w-fit mb-3 ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-Based Sections */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Role</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored experiences for administrators, teachers, students, and parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary text-primary-foreground">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="mb-2">{role.title}</CardTitle>
                        <CardDescription className="mb-4">{role.description}</CardDescription>
                        <ul className="space-y-2">
                          {role.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-success" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Institutions</h2>
            <p className="text-xl text-muted-foreground">See what our users say about Ascentia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm mb-4">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your institution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card
                key={index}
                className={plan.popular ? 'border-primary shadow-lg scale-105' : ''}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium rounded-t-xl">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Institute?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join hundreds of schools and coaching institutes using Ascentia to deliver better learning outcomes
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-xl font-semibold">Ascentia</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered learning management for the modern education era
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Ascentia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

