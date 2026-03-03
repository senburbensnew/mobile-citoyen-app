import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

const { width } = Dimensions.get("window");

// Simple icon components using text/emojis
const IconWrapper = ({ children, style }) => (
  <Text style={style}>{children}</Text>
);

const DocumentItem = ({
  title,
  description,
  category,
  type,
  year,
  access,
  publishedDate,
  fileSize,
  downloads,
  icon,
  iconColor,
  locked = false,
}) => {
  return (
    <View style={[styles.documentCard, locked && styles.lockedCard]}>
      <View style={styles.documentHeader}>
        <View
          style={[
            styles.documentIcon,
            {
              backgroundColor: iconColor.background,
              borderColor: iconColor.border,
            },
          ]}
        >
          <Text style={{ color: iconColor.text, fontSize: 20 }}>{icon}</Text>
        </View>

        <View style={styles.documentContent}>
          <View style={styles.documentTitleRow}>
            <Text style={styles.documentTitle}>{title}</Text>
            {locked && <IconWrapper style={styles.lockIcon}>🔒</IconWrapper>}
          </View>

          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{category}</Text>
            </View>
            <View
              style={[styles.badge, { backgroundColor: iconColor.background }]}
            >
              <Text style={[styles.badgeText, { color: iconColor.text }]}>
                {type}
              </Text>
            </View>
            <View style={[styles.badge, styles.yearBadge]}>
              <Text style={styles.badgeText}>{year}</Text>
            </View>
            <View style={[styles.badge, styles.accessBadge]}>
              <Text style={[styles.badgeText, styles.accessText]}>
                {access}
              </Text>
            </View>
          </View>

          <Text style={styles.documentDescription}>{description}</Text>

          <View style={styles.documentMeta}>
            <View style={styles.metaLeft}>
              <View style={styles.metaItem}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M8 2v4" />
                  <Path d="M16 2v4" />
                  <Rect width={18} height={18} x={3} y={4} rx={2} />
                  <Path d="M3 10h18" />
                </Svg>
                <Text style={styles.metaText}>Publié le {publishedDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <Path d="M14 2v4a2 2 0 0 0 2 2h4" />
                </Svg>
                <Text style={styles.metaText}>PDF • {fileSize}</Text>
              </View>
            </View>
            {/* 
            <View style={styles.metaItem}>
              <IconWrapper style={styles.metaIcon}>⬇️</IconWrapper>
              <Text style={styles.metaText}>{downloads} téléchargements</Text>
            </View> */}
          </View>

          {locked ? (
            <View style={styles.lockedWarning}>
              <IconWrapper style={styles.lockIcon}>🔒</IconWrapper>
              <Text style={styles.lockedText}>
                Accès refusé - Niveau insuffisant
              </Text>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <Circle cx="12" cy="12" r="3" />
                </Svg>
                <Text style={styles.secondaryButtonText}>Voir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <Polyline points="7 10 12 15 17 10" />
                  <Line x1="12" y1="15" x2="12" y2="3" />
                </Svg>

                <Text style={styles.primaryButtonText}>Télécharger</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const GestionDocuments = () => {
  const documents = [
    {
      title: "Loi de Finances 2024-2025",
      description:
        "Document officiel de la loi de finances pour l'année fiscale 2024-2025",
      category: "MEF",
      type: "Loi",
      year: "2024-2025",
      access: "Public",
      publishedDate: "2024-09-15",
      fileSize: "8.5 MB",
      downloads: "12,450",
      icon: "📄",
      iconColor: { background: "#F3E8FF", border: "#D8B4FE", text: "#7C3AED" },
    },
    {
      title: "Budget National Consolidé 2024-2025",
      description: "Budget détaillé de tous les ministères et institutions",
      category: "MEF",
      type: "Budget",
      year: "2024-2025",
      access: "Public",
      publishedDate: "2024-09-20",
      fileSize: "15.2 MB",
      downloads: "8,920",
      icon: "📄",
      iconColor: { background: "#DBEAFE", border: "#93C5FD", text: "#1D4ED8" },
    },
    {
      title: "Rapport d'Exécution Budgétaire T1 2024",
      description: "Rapport trimestriel sur l'exécution du budget national",
      category: "MEF",
      type: "Rapport",
      year: "2023-2024",
      access: "Public",
      publishedDate: "2024-03-30",
      fileSize: "4.8 MB",
      downloads: "5,670",
      icon: "📄",
      iconColor: { background: "#DCFCE7", border: "#86EFAC", text: "#166534" },
    },
    {
      title: "Audit Interne MENFP 2023",
      description: "Rapport d'audit interne du Ministère de l'Éducation",
      category: "MENFP",
      type: "Audit",
      year: "2023-2024",
      access: "Fonctionnaires",
      publishedDate: "2024-02-15",
      fileSize: "6.3 MB",
      downloads: "2,340",
      icon: "📄",
      iconColor: { background: "#FFEDD5", border: "#FDBA74", text: "#C2410C" },
      locked: true,
    },
    {
      title: "Plan d'Investissement Public 2024",
      description: "Programme d'investissement et projets pour 2024",
      category: "MPCE",
      type: "Projet",
      year: "2024-2025",
      access: "Public",
      publishedDate: "2024-08-10",
      fileSize: "11.7 MB",
      downloads: "4,580",
      icon: "📄",
      iconColor: { background: "#CFFAFE", border: "#67E8F9", text: "#0E7490" },
    },
    {
      title: "Rapport Audit MSPP - Détaillé",
      description:
        "Rapport d'audit détaillé avec données sensibles - Accès restreint",
      category: "MSPP",
      type: "Audit",
      year: "2023-2024",
      access: "Grands Commis",
      publishedDate: "2024-04-20",
      fileSize: "3.2 MB",
      downloads: "890",
      icon: "📊",
      iconColor: { background: "#FFEDD5", border: "#FDBA74", text: "#C2410C" },
      locked: true,
    },
    {
      title: "Directives Budgétaires 2025-2026",
      description: "Directives pour la préparation du prochain budget",
      category: "MEF",
      type: "Budget",
      year: "2025-2026",
      access: "Public",
      publishedDate: "2024-10-05",
      fileSize: "2.1 MB",
      downloads: "6,720",
      icon: "📄",
      iconColor: { background: "#DBEAFE", border: "#93C5FD", text: "#1D4ED8" },
    },
    {
      title: "Analyse Sections Budgétaires MTPTC",
      description: "Analyse détaillée des sections et alinéas budgétaires",
      category: "MTPTC",
      type: "Budget",
      year: "2024-2025",
      access: "Fonctionnaires",
      publishedDate: "2024-09-25",
      fileSize: "5.4 MB",
      downloads: "1,250",
      icon: "📊",
      iconColor: { background: "#DBEAFE", border: "#93C5FD", text: "#1D4ED8" },
      locked: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header Banner */}
          <LinearGradient
            colors={["#001F5B", "#003893", "#D21034"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerBanner}
          >
            <View style={styles.bannerHeader}>
              <View style={styles.bannerIcon}>
                <IconWrapper style={styles.folderIcon}>📁</IconWrapper>
              </View>
              <Text style={styles.bannerTitle}>Documents Officiels</Text>
            </View>
            <Text style={styles.bannerSubtitle}>8 documents disponibles</Text>
          </LinearGradient>

          {/* Search and Filters Card */}
          <View style={styles.filterCard}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <IconWrapper style={styles.searchIcon}>🔍</IconWrapper>
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un document..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Filters */}
            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Catégorie</Text>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>Tous</Text>
                  <IconWrapper style={styles.chevronIcon}>⌄</IconWrapper>
                </TouchableOpacity>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Année fiscale</Text>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>Tous</Text>
                  <IconWrapper style={styles.chevronIcon}>⌄</IconWrapper>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Documents List */}
          <View style={styles.documentsList}>
            {documents.map((doc, index) => (
              <DocumentItem key={index} {...doc} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F9FAFB",
    // borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 0,
    // paddingBottom: 100,
  },
  headerBanner: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  folderIcon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  bannerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 10,
    zIndex: 1,
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 12,
    paddingVertical: 8,
    fontSize: 16,
    height: 40,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 40,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  chevronIcon: {
    fontSize: 16,
    color: "#6B7280",
  },
  documentsList: {
    gap: 16,
  },
  documentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  lockedCard: {
    opacity: 0.6,
  },
  documentHeader: {
    flexDirection: "row",
    gap: 16,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  documentContent: {
    flex: 1,
    minWidth: 0,
  },
  documentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  yearBadge: {
    backgroundColor: "#F9FAFB",
  },
  accessBadge: {
    backgroundColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  accessText: {
    color: "#166534",
  },
  documentDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  documentMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metaLeft: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  buttonIcon: {
    fontSize: 14,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 36,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  lockedWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: 12,
  },
  lockIcon: {
    fontSize: 14,
  },
  lockedText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
  },
});

export default GestionDocuments;
