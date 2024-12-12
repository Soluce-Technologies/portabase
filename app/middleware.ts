// import {NextResponse} from "next/server";
// import {useStore} from "@/state-management/store";
//
// export function middleware(req) {
//     // const organizationId = req.cookies.get("organizationId") || "default"; // Retrieve from cookies
//     const url = req.nextUrl.clone();
//     const {organizationId, moveToAnotherOrganization} = useStore((state) => state);
//     console.log("middlewaressss", organizationId);
//     // url.searchParams.set("organizationId", organizationId); // Append to query string
//     return NextResponse.rewrite(url);
// }