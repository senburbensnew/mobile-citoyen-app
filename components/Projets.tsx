import {
  Briefcase,
  Search,
  ChevronDown,
  Clock,
  CircleCheckBig,
  CircleAlert,
  DollarSign,
  Users,
  Calendar,
  MapPin,
} from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const Projets = () => {
  const projects = [
    {
      id: 1,
      title: "Réhabilitation Route Nationale #1",
      ministry: "MTPTC",
      status: "En cours",
      statusColor: "#3b82f6",
      description:
        "Projet de réhabilitation complète de la route nationale incluant le drainage et l'éclairage",
      progress: 72,
      budget: "45.5 Md HTG",
      spent: "32.8 Md HTG",
      beneficiaries: "250,000",
      period: "2024-01 - 2025-06",
      location: "Port-au-Prince - Cap-Haïtien",
    },
    {
      id: 2,
      title: "Programme National de Vaccination",
      ministry: "MSPP",
      status: "Terminé",
      statusColor: "#10b981",
      description: "Campagne de vaccination complète pour enfants et adultes",
      progress: 100,
      budget: "12.3 Md HTG",
      spent: "12.3 Md HTG",
      beneficiaries: "1,500,000",
      period: "2024-01 - 2024-12",
      location: "National",
    },
    {
      id: 3,
      title: "Construction de 50 Écoles Primaires",
      ministry: "MENFP",
      status: "En cours",
      statusColor: "#3b82f6",
      description:
        "Construction et équipement de nouvelles écoles dans les zones rurales",
      progress: 63,
      budget: "28.7 Md HTG",
      spent: "18.2 Md HTG",
      beneficiaries: "75,000",
      period: "2023-09 - 2025-08",
      location: "Départements du Nord et du Sud",
    },
    {
      id: 4,
      title: "Électrification Rurale Phase II",
      ministry: "MEF",
      status: "Retardé",
      statusColor: "#ef4444",
      description:
        "Extension du réseau électrique vers les communautés rurales",
      progress: 55,
      budget: "35.9 Md HTG",
      spent: "28.4 Md HTG",
      beneficiaries: "120,000",
      period: "2024-03 - 2025-12",
      location: "Artibonite, Centre",
      restricted: true,
    },
    {
      id: 5,
      title: "Système d'Irrigation Moderne",
      ministry: "MARNDR",
      status: "En cours",
      statusColor: "#3b82f6",
      description:
        "Modernisation du système d'irrigation pour augmenter la production agricole",
      progress: 75,
      budget: "19.4 Md HTG",
      spent: "14.6 Md HTG",
      beneficiaries: "45,000",
      period: "2024-02 - 2025-03",
      location: "Plaine de l'Artibonite",
    },
  ];

  const StatusBadge = ({ status, color, icon: Icon }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: color,
      }}
    >
      <Icon size={16} color="#fff" />
      <Text style={{ fontSize: 12, color: "#fff", fontWeight: "500" }}>
        {status}
      </Text>
    </View>
  );

  const MinistryBadge = ({ ministry }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <Text style={{ fontSize: 12, color: "#374151", fontWeight: "500" }}>
        {ministry}
      </Text>
    </View>
  );

  const ProgressBar = ({ progress }) => (
    <View
      style={{
        height: 8,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          backgroundColor: "#3b82f6",
          borderRadius: 4,
          width: `${progress}%`,
        }}
      />
    </View>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <View
      style={{
        flex: 1,
        minWidth: (width - 80) / 2,
        borderRadius: 8,
        padding: 12,
        gap: 8,
        backgroundColor: `${color}15`,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Icon size={16} color={color} />
        <Text style={{ fontSize: 12, fontWeight: "500", color: color }}>
          {label}
        </Text>
      </View>
      <Text style={{ fontSize: 14, fontWeight: "600", color: color }}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section - SOLID COLOR VERSION */}
        <View
          style={{
            marginVertical: 8,
            marginTop: 2,
            borderRadius: 16,
            padding: 24,
            backgroundColor: "#001F5B",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View style={{ gap: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Briefcase size={24} color="#fff" />
              </View>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                Projets Gouvernementaux
              </Text>
            </View>
            <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
              5 projets au total
            </Text>
          </View>
        </View>

        {/* Search and Filters Section */}
        <View
          style={{
            marginVertical: 8,
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 16,
            gap: 16,
          }}
        >
          {/* Search Input */}
          <View style={{ position: "relative" }}>
            <Search
              size={16}
              color="#9ca3af"
              style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
            />
            <TextInput
              style={{
                height: 36,
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 8,
                paddingLeft: 40,
                paddingRight: 12,
                fontSize: 14,
                backgroundColor: "#f9fafb",
              }}
              placeholder="Rechercher un projet..."
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Filters Row */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                Statut
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 36,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#f9fafb",
                }}
              >
                <Text style={{ fontSize: 14, color: "#374151" }}>Tous</Text>
                <ChevronDown size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                Catégorie
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 36,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#f9fafb",
                }}
              >
                <Text style={{ fontSize: 14, color: "#374151" }}>Tous</Text>
                <ChevronDown size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Projects List */}
        <View
          style={{
            gap: 16,
            paddingVertical: 8,
          }}
        >
          {projects.map((project) => (
            <View
              key={project.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                padding: 20,
                gap: 16,
              }}
            >
              {/* Project Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: 8,
                    }}
                  >
                    {project.title}
                  </Text>
                  <View
                    style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}
                  >
                    <MinistryBadge ministry={project.ministry} />
                    <StatusBadge
                      status={project.status}
                      color={project.statusColor}
                      icon={
                        project.status === "Terminé"
                          ? CircleCheckBig
                          : project.status === "Retardé"
                          ? CircleAlert
                          : Clock
                      }
                    />
                    {project.restricted && (
                      <View
                        style={{
                          backgroundColor: "#fffbeb",
                          borderWidth: 1,
                          borderColor: "#fed7aa",
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#92400e",
                            fontWeight: "500",
                          }}
                        >
                          Accès restreint
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Project Description */}
              <Text style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
                {project.description}
              </Text>

              {/* Progress Bar */}
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>
                    Progrès
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#3b82f6",
                      fontWeight: "500",
                    }}
                  >
                    {project.progress}%
                  </Text>
                </View>
                <ProgressBar progress={project.progress} />
              </View>

              {/* Stats Grid */}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                <StatCard
                  icon={DollarSign}
                  label="Budget"
                  value={project.budget}
                  color="#3b82f6"
                />
                <StatCard
                  icon={DollarSign}
                  label="Dépensé"
                  value={project.spent}
                  color="#10b981"
                />
                <StatCard
                  icon={Users}
                  label="Bénéficiaires"
                  value={project.beneficiaries}
                  color="#8b5cf6"
                />
                <StatCard
                  icon={Calendar}
                  label="Période"
                  value={project.period}
                  color="#f59e0b"
                />
              </View>

              {/* Location */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "#f3f4f6",
                }}
              >
                <MapPin size={16} color="#6b7280" />
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  {project.location}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Projets;
