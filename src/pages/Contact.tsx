import { Mail, Phone, MapPin, MessageCircle, Send, Clock, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "Get in touch with our team",
      contact: "varunb1135@gmail.com",
      subtext: "We respond within 24 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Mon-Fri from 9AM to 6PM IST",
      contact: "+91 98765 43210",
      subtext: "Instant support available"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      description: "Come say hello at our office",
      contact: "123, Bhopoal, India 460001",
      subtext: "By appointment only"
    }
  ];

  const faqItems = [
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to emails within 24 hours. For urgent matters, please use our live chat or call us during business hours."
    },
    {
      question: "Do you offer phone support?",
      answer: "Yes, we offer phone support Monday through Friday, 9AM to 6PM IST. Our team is ready to help with any questions you may have."
    },
    {
      question: "Can I visit your office?",
      answer: "Yes, but please schedule an appointment first. We'd love to meet you and show you around our culinary workspace."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isVegMode={true} onToggleVegMode={() => {}} />
      
      <main className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need help? We're here to assist you on your culinary journey.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {contactInfo.map((info, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-soft transition-shadow">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {info.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
              <p className="font-medium text-foreground mb-1">{info.contact}</p>
              <p className="text-xs text-muted-foreground">{info.subtext}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <form className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your question or feedback..."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Office Hours & FAQ */}
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Office Hours</h2>
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground font-medium">9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground font-medium">10:00 AM - 4:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground font-medium">Closed</span>
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Chat Banner */}
        <div className="mt-12 text-center rounded-2xl bg-primary p-8 text-primary-foreground">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-4">Prefer Live Chat?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Get instant answers from our support team through our live chat feature.
          </p>
          <Button variant="secondary" size="lg" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Start Live Chat
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
