ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own endpoints" 
ON endpoints 
FOR ALL 
USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own notifications" 
ON notifications 
FOR ALL 
USING (auth.uid() = user_id);