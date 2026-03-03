import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
interface Notification {
  id: number;
  type: "rapport" | "directive" | "info";
  title: string;
  description: string;
  date: string;
  priority: "high" | "medium" | "low";
  read: boolean;
  ministry: string;
  category: string;
}

type FilterType = "all" | "unread" | "urgent";

const filterOptions = [
  { label: "Toutes les notifications", value: "all" },
  { label: "Non lues", value: "unread" },
  { label: "Urgentes", value: "urgent" },
];

const categoryOptions = [
  { label: "Toutes les catégories", value: "all" },
  { label: "Rapports", value: "rapport" },
  { label: "Directives", value: "directive" },
  { label: "Informations", value: "info" },
];

// Utility functions
const getTypeColor = (priority: string) => {
  switch (priority) {
    case "high":
      return { backgroundColor: "#FEE2E2", iconColor: "#DC2626" };
    case "medium":
      return { backgroundColor: "#DBEAFE", iconColor: "#2563EB" };
    case "low":
      return { backgroundColor: "#DCFCE7", iconColor: "#10B981" };
    default:
      return { backgroundColor: "#F3F4F6", iconColor: "#6B7280" };
  }
};

const getTypeIcon = (type: string, size = 20) => {
  switch (type) {
    case "rapport":
      return <Feather name="file-text" size={size} color="#2563EB" />;
    case "directive":
      return <Feather name="alert-circle" size={size} color="#DC2626" />;
    case "info":
      return <Feather name="info" size={size} color="#10B981" />;
    default:
      return <Feather name="bell" size={size} color="#6B7280" />;
  }
};

// Components
const NotificationCard = ({
  item,
  onPress,
  onDelete,
}: {
  item: Notification;
  onPress: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const typeColor = getTypeColor(item.priority);

  const handlePress = () => {
    // Animation when pressing
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress(item.id);
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la notification",
      "Êtes-vous sûr de vouloir supprimer cette notification ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, paddingHorizontal: 16 }}>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleDelete}
        delayLongPress={500}
        accessible={true}
        accessibilityLabel={`Notification: ${item.title}. ${
          item.read ? "Déjà lue" : "Non lue"
        }. Appuyer pour marquer comme lue. Appuyer longuement pour supprimer.`}
        accessibilityRole="button"
        style={{
          backgroundColor: item.read ? "white" : "#DBEAFE",
          padding: 16,
          borderRadius: 8,
          marginBottom: 12,
          borderLeftWidth: item.read ? 0 : 4,
          borderLeftColor: "#2563EB",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              backgroundColor: typeColor.backgroundColor,
              padding: 8,
              borderRadius: 8,
              marginRight: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {getTypeIcon(item.type)}
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  fontWeight: item.read ? "400" : "600",
                  fontSize: 14,
                  flex: 1,
                  marginRight: 8,
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {!item.read && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#2563EB",
                  }}
                />
              )}
            </View>

            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 4,
                marginTop: 2,
              }}
            >
              {item.ministry} • {item.category}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#374151",
                marginBottom: 8,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {new Date(item.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Feather name="more-vertical" size={14} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyState = () => (
  <View
    style={{
      backgroundColor: "white",
      padding: 24,
      borderRadius: 8,
      alignItems: "center",
      marginVertical: 20,
      marginHorizontal: 16,
    }}
  >
    <Feather
      name="bell"
      size={48}
      color="#9CA3AF"
      style={{ marginBottom: 12 }}
    />
    <Text style={{ fontSize: 18, marginBottom: 6, fontWeight: "600" }}>
      Aucune notification
    </Text>
    <Text style={{ color: "#6B7280", textAlign: "center", lineHeight: 20 }}>
      Vous n'avez aucune notification pour le moment.
    </Text>
  </View>
);

// Main Component
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Load notifications from storage on mount
  React.useEffect(() => {
    loadNotifications();
  }, []);

  // Save notifications to storage when they change
  React.useEffect(() => {
    saveNotifications();
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem("notifications");
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Error saving notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const loadMore = () => {
    // No alert functionality when there are no more notifications
    // This function can be left empty or used for actual pagination in the future
  };

  const debouncedSearch = (text: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(text);
    }, 300);
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !n.read) ||
      (filter === "urgent" && n.priority === "high");

    const matchesCategory =
      categoryFilter === "all" || n.type === categoryFilter;

    const matchesSearch =
      searchTerm === "" ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesCategory && matchesSearch;
  });

  const HeaderStats = () => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 4 }}>
            Notifications
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>
            Actualités gouvernementales
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="bell" size={24} color="#2563EB" />
          {unreadCount > 0 && (
            <View
              style={{
                backgroundColor: "#DC2626",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginLeft: 8,
                minWidth: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
              >
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#DBEAFE",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginRight: 6,
          }}
        >
          <Feather
            name="bell"
            size={20}
            color="#2563EB"
            style={{ marginBottom: 4 }}
          />
          <Text style={{ fontSize: 12, color: "#2563EB", fontWeight: "500" }}>
            Total
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {notifications.length}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#FEE2E2",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginHorizontal: 3,
          }}
        >
          <Feather
            name="alert-circle"
            size={20}
            color="#DC2626"
            style={{ marginBottom: 4 }}
          />
          <Text style={{ fontSize: 12, color: "#DC2626", fontWeight: "500" }}>
            Non lues
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {unreadCount}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#DCFCE7",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginLeft: 6,
          }}
        >
          <Feather
            name="check-circle"
            size={20}
            color="#10B981"
            style={{ marginBottom: 4 }}
          />
          <Text style={{ fontSize: 12, color: "#10B981", fontWeight: "500" }}>
            Lues
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {notifications.length - unreadCount}
          </Text>
        </View>
      </View>
    </View>
  );

  const FiltersSection = () => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather
            name="filter"
            size={18}
            color="#6B7280"
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 16, color: "#374151", fontWeight: "600" }}>
            Filtrer
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: "#F9FAFB",
            }}
          >
            <Text style={{ fontSize: 14, color: "#374151", fontWeight: "500" }}>
              Tout lire
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter */}
      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            marginBottom: 6,
            fontWeight: "500",
          }}
        >
          Statut
        </Text>
        <Dropdown
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: "#D1D5DB",
          }}
          data={filterOptions}
          labelField="label"
          valueField="value"
          value={filter}
          placeholder="Sélectionner un filtre"
          onChange={(item) => setFilter(item.value)}
          selectedTextStyle={{ fontSize: 14 }}
          placeholderStyle={{ fontSize: 14, color: "#9CA3AF" }}
        />
      </View>

      {/* Category Filter */}
      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            marginBottom: 6,
            fontWeight: "500",
          }}
        >
          Catégorie
        </Text>
        <Dropdown
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: "#D1D5DB",
          }}
          data={categoryOptions}
          labelField="label"
          valueField="value"
          value={categoryFilter}
          placeholder="Sélectionner une catégorie"
          onChange={(item) => setCategoryFilter(item.value)}
          selectedTextStyle={{ fontSize: 14 }}
          placeholderStyle={{ fontSize: 14, color: "#9CA3AF" }}
        />
      </View>

      {/* Search */}
      <View>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            marginBottom: 6,
            fontWeight: "500",
          }}
        >
          Rechercher
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#D1D5DB",
            paddingLeft: 12,
            height: 44,
          }}
        >
          <Feather
            name="search"
            size={18}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Rechercher dans les notifications..."
            placeholderTextColor="#9CA3AF"
            onChangeText={debouncedSearch}
            style={{
              flex: 1,
              fontSize: 14,
              color: "#374151",
              paddingVertical: 10,
            }}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
    </View>
  );

  const renderNotification = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationCard
        item={item}
        onPress={markAsRead}
        onDelete={deleteNotification}
      />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Notification) => item.id.toString(),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={keyExtractor}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <HeaderStats />
            <FiltersSection />
          </View>
        }
        ListEmptyComponent={EmptyState}
        contentContainerStyle={{
          paddingBottom: 20,
          flex: filteredNotifications.length === 0 ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
