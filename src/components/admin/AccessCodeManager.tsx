import { useEffect, useState } from "react";
import { supabase } from "../../../integrations/supabase/client"; // adjust path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface AccessCode {
  id: string;
  code: string;
  role: string;
  expires_at: string;
  used: boolean;
}

const AccessCodeManager = () => {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [newCode, setNewCode] = useState("");
  const [role, setRole] = useState("editor");

  const loadCodes = async () => {
    const { data, error } = await supabase
      .from("access_codes")
      .select("*")
      .order("expires_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading codes", variant: "destructive" });
    } else {
      setCodes(data);
    }
  };

  const addCode = async () => {
    if (!newCode) return;

    const { error } = await supabase.from("access_codes").insert([
      {
        code: newCode,
        role,
      },
    ]);

    if (error) {
      toast({ title: "Error creating code", variant: "destructive" });
    } else {
      toast({ title: "Access code added" });
      setNewCode("");
      loadCodes();
    }
  };

  const deleteCode = async (id: string) => {
    const { error } = await supabase.from("access_codes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting code", variant: "destructive" });
    } else {
      toast({ title: "Access code deleted" });
      loadCodes();
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle>Manage Access Codes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
            placeholder="New access code"
          />
          <select
            className="border rounded px-2 py-1"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={addCode}>Add Code</Button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {codes.map(code => (
            <div
              key={code.id}
              className="flex justify-between items-center border rounded px-4 py-2 bg-muted"
            >
              <div>
                <div className="font-mono">{code.code}</div>
                <div className="text-sm text-gray-500">
                  Role: {code.role} • Used: {code.used ? "Yes" : "No"} • Expires:{" "}
                  {new Date(code.expires_at).toLocaleDateString()}
                </div>
              </div>
              <Button variant="destructive" onClick={() => deleteCode(code.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessCodeManager;
