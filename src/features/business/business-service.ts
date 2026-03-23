import { businessProfile } from "@/lib/mock-data";
import { BusinessProfile } from "@/types/domain";

export async function getBusinessProfile(): Promise<BusinessProfile> {
  return businessProfile;
}
