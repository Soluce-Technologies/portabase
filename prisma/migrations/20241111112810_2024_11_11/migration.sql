-- AddForeignKey
ALTER TABLE "Database" ADD CONSTRAINT "Database_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
