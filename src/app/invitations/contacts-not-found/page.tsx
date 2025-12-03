import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, UserPlus, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function ContactsNotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Contact Not Found</h1>
          <p className="text-muted-foreground">
            We couldn&apos;t find any contacts matching your search. This might be because the email address doesn&apos;t exist in our system yet.
          </p>
        </div>

        {/* Main Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Invitation Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Send Email Invitation</h3>
                    <p className="text-xs text-muted-foreground">
                      Send an invitation to the email address directly
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Invite New Contact</h3>
                    <p className="text-xs text-muted-foreground">
                      Create a new contact and send invitation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/invitations/send">
                  Send Email Invitation
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/invitations/create-contact">
                  Create New Contact
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Make sure the email address is correct</p>
              <p>• Check if the person already has an account</p>
              <p>• Try searching with a different email format</p>
            </div>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/help/contact-support">
                Contact Support
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
