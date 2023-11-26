import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CardAvatarCreate } from "./CardAvatarCreate"
import { ModeToggle } from "./mode-toggle"

export function LandingPage() {
  return (
    <div className="flex flex-col justify-between items-center w-full"> {/* Full screen container */}
      <h1 className="mt-16 mb-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to Firepit <ModeToggle/>
      </h1>
      <code>Version 0.0.1</code>
    <br></br>
    <Tabs defaultValue="join" className="w-[800px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="join">Join A Room</TabsTrigger>
        <TabsTrigger value="create">Create The Room</TabsTrigger>
      </TabsList>

  {/* JOIN ROOM TAB MAIN UI */}

  <TabsContent value="join">
  <Card>
          <CardHeader>
            <CardTitle>Room Access Code</CardTitle>
            <CardDescription>Enter the access code you received.</CardDescription>
            <Input type="text" placeholder="e.g., A1B2C3" />
          </CardHeader>
        <hr/>
          <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
        <CardDescription>Select a unique nickname and choose your avatar.</CardDescription>
          </CardHeader>
    
    <div className="flex justify-center mb-4">
    <CardAvatarCreate/>
    </div>
  </Card>

  {/* CREATE ROOM TAB MAIN UI */}

      </TabsContent>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create The Room</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}
