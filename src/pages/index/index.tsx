import { router, Text, useState, View } from "@astralsight/astroforge-core";
import "../../vela-tailwind.css";
import "../../tailwind.css";

export default function IndexPage() {
    const [count, setCount] = useState(0);

    const countAdd = () => {
        setCount(count + 1);
    };

    const toDetail = () => {
        router.push({
            uri: "pages/detail/detail"
        });
    };

    return (
        <View className="flex h-full w-full flex-col items-center justify-center">
            <Text className="w-full text-center text-green-600">
                Hello, AstroForge!
            </Text>

            <Text className="w-full text-center text-red-600">
                Hi!!!
            </Text>

            <Text>{count}</Text>

            <View
                className="flex h-12 w-24 items-center justify-center rounded-lg bg-white"
                onClick={countAdd}
            >
                <Text className="w-full text-center text-black">点。</Text>
            </View>

            <View
                className="flex h-12 w-24 items-center justify-center rounded-lg bg-white"
                onClick={toDetail}
            >
                <Text className="w-full text-center text-black">跳。</Text>
            </View>
        </View>
    );
}
