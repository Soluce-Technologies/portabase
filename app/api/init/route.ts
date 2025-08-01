import { NextResponse } from "next/server";

export type BodyInit = {
    initialize: boolean;
};

export async function POST(request: Request) {
    try {
        const body: BodyInit = await request.json();

        console.log(body);

        return NextResponse.json(
            {
                message: "Initialization successfully done!",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST initialization:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
