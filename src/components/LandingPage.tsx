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

export function LandingPage() {
  return (
    <div className="flex flex-col justify-between items-center w-full"> {/* Full screen container */}
      <h1 className="mt-20 mb-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to Firepit
      </h1>
      <code>Version 0.0.1</code>

    <Tabs defaultValue="join" className="w-[800px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="join">Join A Room</TabsTrigger>
        <TabsTrigger value="create">Create The Room</TabsTrigger>
      </TabsList>

      <TabsContent value="join">

        <Card>
          <CardHeader>
            <CardTitle>Join A Room</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
    <div className="flex justify-center mb-4">
    <CardAvatarCreate/>
    </div>
        </Card>

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
