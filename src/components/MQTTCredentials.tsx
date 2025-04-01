"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface MQTTCredentialsFormProps {
  onSubmit?: (data: {
    url: string;
    username: string;
    password: string;
  }) => void;
}

export default function MQTTCredentialsForm({
  onSubmit,
}: MQTTCredentialsFormProps) {
  const [formData, setFormData] = useState({
    url: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("MQTT Credentials:", formData);

    // Call the provided onSubmit handler if it exists
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Default behavior if no onSubmit is provided
      toast({
        title: "Credentials Saved",
        description: "Your MQTT credentials have been saved successfully.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>MQTT Credentials</CardTitle>
        <CardDescription>
          Enter your MQTT broker connection details
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Broker URL</Label>
            <Input
              id="url"
              name="url"
              placeholder="mqtt://example.com:1883"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Save Credentials
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
