import PropertyCard from "@/components/PropertyCard";
import useFetch from "@/hooks/useFetch";
import { SavedProperty } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Saved() {
  const { userId } = useAuth();
  const router = useRouter();

  const {
    loading,
    error,
    data: saved,
    refetch,
  } = useFetch<SavedProperty[]>("/saved_properties");

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900">Saved</Text>
        {!loading && (
          <Text className="text-sm text-gray-400 mt-1">
            {saved?.length} {saved?.length === 1 ? "property" : "properties"}
          </Text>
        )}
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertyCard
              property={item.properties}
              // onUnsave={() =>
              //   setSaved((prev) => prev.filter((s) => s.id !== item.id))
              // }
              showSave
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
                <Ionicons name="heart-outline" size={36} color="#EF4444" />
              </View>
              <Text className="text-gray-700 text-lg font-bold mb-1">
                No Saved properties
              </Text>
              <Text className="text-gray-400 text-sm text-center px-8">
                Tap the heart icon on any property to save it here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
