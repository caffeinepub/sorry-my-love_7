import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Loader2, Save, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSetUserName } from "../hooks/useQueries";

interface SettingsProps {
  userName: string;
  onUserNameChange: (name: string) => void;
}

export default function Settings({
  userName,
  onUserNameChange,
}: SettingsProps) {
  const [nameInput, setNameInput] = useState(userName);
  const [preferredCategory, setPreferredCategory] = useState("mixed");
  const [sessionLength, setSessionLength] = useState("30");
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);

  const setUserName = useSetUserName();

  const handleSaveProfile = async () => {
    if (!nameInput.trim()) return;
    await setUserName.mutateAsync(nameInput.trim());
    onUserNameChange(nameInput.trim());
    toast.success("Profile saved successfully!");
  };

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your interview coaching experience
        </p>
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Profile</CardTitle>
            </div>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Display Name
              </Label>
              <Input
                id="name"
                data-ocid="settings.name.input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                className="mt-1.5"
              />
            </div>
            <Button
              data-ocid="settings.save_profile.primary_button"
              onClick={handleSaveProfile}
              disabled={setUserName.isPending || !nameInput.trim()}
              className="bg-primary text-primary-foreground font-semibold"
            >
              {setUserName.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Interview Preferences */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Interview Preferences</CardTitle>
            </div>
            <CardDescription>Customize your practice sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Preferred Category</Label>
              <Select
                value={preferredCategory}
                onValueChange={setPreferredCategory}
              >
                <SelectTrigger
                  data-ocid="settings.category.select"
                  className="mt-1.5"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed (All Categories)</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="situational">Situational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Session Length</Label>
              <Select value={sessionLength} onValueChange={setSessionLength}>
                <SelectTrigger
                  data-ocid="settings.session_length.select"
                  className="mt-1.5"
                >
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Session Reminders
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Remind me to practice daily
                </p>
              </div>
              <Switch
                data-ocid="settings.notifications.switch"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Daily Goal Alerts
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Alert when daily goal is achieved
                </p>
              </div>
              <Switch
                data-ocid="settings.daily_reminder.switch"
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
