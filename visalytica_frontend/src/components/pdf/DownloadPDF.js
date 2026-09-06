"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { COLORS, PDF_FONTS, PDF_LAYOUT } from "../../constants/theme";
import logoVisalytica from "../../assets/logoVisalytica.svg";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

// Estilos para o PDF
// @react-pdf/renderer usa seu próprio sistema de estilos (StyleSheet)
// NÃO é possível usar Tailwind no PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: COLORS.pdf.background,
    padding: PDF_LAYOUT.page.padding,
    fontFamily: PDF_FONTS.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.pdf.header,
    borderBottomStyle: "solid",
    paddingBottom: 2,
  },
  logo: {
    width: 150,
    height: 50,
  },
  title: {
    fontSize: PDF_FONTS.sizes.title,
    fontWeight: "bold",
    color: COLORS.pdf.header,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: PDF_LAYOUT.spacing.small,
  },
  subtitle: {
    fontSize: PDF_FONTS.sizes.title,
    color: COLORS.pdf.subtext,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: PDF_LAYOUT.spacing.section,
  },
  sectionTitle: {
    fontSize: PDF_FONTS.sizes.sectionTitle,
    fontWeight: "bold",
    color: COLORS.pdf.header,
    marginBottom: PDF_LAYOUT.spacing.row,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.pdf.border,
    borderBottomStyle: "solid",
    paddingBottom: PDF_LAYOUT.spacing.small,
  },
  row: {
    flexDirection: "row",
    marginBottom: PDF_LAYOUT.spacing.row,
    alignItems: "flex-start",
  },
  label: {
    fontSize: PDF_FONTS.sizes.text,
    fontWeight: "bold",
    color: COLORS.pdf.text,
    width: "35%",
    textAlign: "left",
  },
  value: {
    fontSize: PDF_FONTS.sizes.text,
    color: COLORS.pdf.subtext,
    width: "65%",
    textAlign: "left",
  },
  observacoes: {
    fontSize: PDF_FONTS.sizes.sectionTitle,
    color: COLORS.pdf.subtext,
    lineHeight: 1.3,
    textAlign: "left",
  },
  footer: {
    position: "absolute",
    bottom: PDF_LAYOUT.page.padding,
    left: PDF_LAYOUT.page.padding,
    right: PDF_LAYOUT.page.padding,
    textAlign: "center",
    fontSize: PDF_FONTS.sizes.text,
    color: COLORS.textLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.pdf.border,
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  diagnosticoBox: {
    marginTop: 10,
    width: "100%",
  },
  observacoesBox: {
    marginTop: 10,
    width: "100%",
  },
  diagnosticoText: {
    fontSize: PDF_FONTS.sizes.sectionTitle,
    color: COLORS.pdf.text,
    lineHeight: 1.4,
    textAlign: "left",
  },
  dataRelatorio: {
    fontSize: PDF_FONTS.sizes.text,
    color: COLORS.textLight,
    textAlign: "right",
    marginTop: PDF_LAYOUT.spacing.small,
  },
  // Novos estilos para personalização
  dadosContainer: {
    width: "70%",
    alignSelf: "flex-start",
    marginLeft: 0,
    paddingLeft: 0,
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  logosRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: PDF_LAYOUT.spacing.section,
  },
  logoSeparator: {
    width: 2,
    height: 30,
    backgroundColor: COLORS.pdf.header,
    marginHorizontal: PDF_LAYOUT.spacing.section,
  },
  clinicInfo: {
    fontSize: PDF_FONTS.sizes.text,
    color: COLORS.pdf.subtext,
    textAlign: "center",
    marginBottom: PDF_LAYOUT.spacing.section,
  },
  assinaturaSection: {
    marginTop: 20,
    paddingTop: PDF_LAYOUT.spacing.section,
  },
  assinaturaBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },
  assinaturaItem: {
    width: "45%",
    textAlign: "center",
  },
  assinaturaLinha: {
    borderTopWidth: 1,

    borderTopColor: COLORS.pdf.text,
    borderTopStyle: "solid",
    marginBottom: PDF_LAYOUT.spacing.small,
    paddingTop: 2,
  },
  assinaturaTexto: {
    fontSize: PDF_FONTS.sizes.text,
    color: COLORS.pdf.subtext,
  },
  numeroRelatorio: {
    position: "absolute",
    top: PDF_LAYOUT.page.padding,
    right: PDF_LAYOUT.page.padding,
    fontSize: PDF_FONTS.sizes.small,
    color: COLORS.textLight,
  },
  footerLogos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: PDF_LAYOUT.spacing.small,
  },
  footerLogoSeparator: {
    width: 1,
    height: 15,
    backgroundColor: COLORS.pdf.header,
    marginHorizontal: 8,
  },
});

export default function RelatorioMedicoPDF({ dados, medico }) {

  const [config, setConfig] = useState({
    endereco: "Av. Lins de Vasconcelos, 1222 - Aclimação, São Paulo - SP,",
    telefone: "(11) 1234-5678",
    email: "contato@visalytica.com.br",

    // MELHORIA IMPORTANTE: Implementar integração com sistema de autenticação
    // Deve puxar automaticamente os dados do médico logado do sistema
    // Exemplo: const { user } = useAuth(); medico: user.nome, crm: user.crm
    medico: medico.nome, // Nome do médico logado exemplo
    crm: medico.crm, // CRM do médico logado exemplo
    especialidade: medico.role,
  })

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // console.log(dados);
  

  // Número do relatório único
  const numeroRelatorio = `REL-${new Date().getFullYear()}-${String(
    Date.now()
  ).slice(-6)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Número do Relatório */}
        <Text style={styles.numeroRelatorio}>Relatório: {numeroRelatorio}</Text>

        {/* Cabeçalho com Logo e Informações da Clínica */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Logos da Visalytica e Dasa */}
            <View style={styles.logosRow}>
              <Image
                src="/logoVisalyticaAzulClaro.png"
                style={PDF_LAYOUT.logo.visalytica}
              />
              <View style={styles.logoSeparator}></View>
              <Image src="/LogoDasa.png" style={PDF_LAYOUT.logo.dasa} />
            </View>
            <View>
              <Text style={styles.clinicInfo}>
                Av. Lins de Vasconcelos, 1222 - Aclimação, São Paulo - SP
              </Text>
              <Text style={styles.clinicInfo}>
                Tel: {config.telefone} | Email: {config.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Título do Relatório */}
        <View style={styles.section}>
          <Text style={styles.title}>RELATÓRIO DE EXAME ANATOMOPATOLÓGICO</Text>
        </View>

        {/* Dados do Paciente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS DO PACIENTE</Text>
          <View style={styles.dadosContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Nome Completo:</Text>
              <Text style={styles.value}>
                {dados.paciente.nome || "Não informado"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>CPF:</Text>
              <Text style={styles.value}>
                {dados.paciente.cpf || "Não informado"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Data de Nascimento:</Text>
              <Text style={styles.value}>
                {dados.paciente.dataNascimento || "Não informado"}
              </Text>
            </View>
          </View>
        </View>

        {/* Dados da Amostra */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS DA AMOSTRA</Text>
          <View style={styles.dadosContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Nome da Peça:</Text>
              <Text style={styles.value}>
                {dados.nomeAmostra || "Não informado"}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Dimensões (C x L x A):</Text>
              <Text style={styles.value}>
                {`${dados.comprimento} x ${dados.largura} x ${dados.altura}` ||
                  "Não informado"}
              </Text>
            </View>
          </View>
        </View>

        {/* Diagnóstico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIAGNÓSTICO</Text>
          <View style={styles.diagnosticoBox}>
            <Text style={styles.diagnosticoText}>
              {dados.possivelDiagnostico || "Diagnóstico não informado"}
            </Text>
          </View>
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBSERVAÇÕES CLÍNICAS</Text>
          <View style={styles.observacoesBox}>
            <Text style={styles.observacoes}>
              {dados.observacoes || "Nenhuma observação adicional registrada."}
            </Text>
          </View>
        </View>

        {/* Seção das imagens capturadas */}
        {dados.imageUrls && (
          <View style={styles.assinaturaSection}>
            {dados?.imageUrls[0] && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>Imagem lateral:</Text>
                <Image
                  src={dados.imageUrls[0]}
                  style={{ width: 200, height: 200 }}
                />
              </View>
            )}

            {dados?.imageUrls[1] && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>Imagem superior:</Text>
                <Image
                  src={dados.imageUrls[1]}
                  style={{ width: 200, height: 200 }}
                />
              </View>
            )}
          </View>
        )}

        {/* Seção de Assinatura */}
        <View style={styles.assinaturaSection}>
          <Text style={styles.sectionTitle}>RESPONSÁVEL TÉCNICO</Text>

          <View style={styles.assinaturaBox}>
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={[styles.assinaturaLinha, { width: "30%" }]}></View>
              <Text style={styles.assinaturaTexto}>{config.medico}</Text>
              <Text style={styles.assinaturaTexto}>
                {config.crm} - {config.especialidade}
              </Text>
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <View style={styles.logosRow}>
            <Image
              src="/logoVisalyticaAzulClaro.png"
              style={PDF_LAYOUT.logo.visalytica}
            />
            <View style={styles.logoSeparator}></View>
            <Image src="/LogoDasa.png" style={PDF_LAYOUT.logo.dasa} />
          </View>
          <Text
            style={{ fontSize: PDF_FONTS.sizes.small, color: COLORS.textLight }}
          >
            Relatório gerado automaticamente pelo sistema
          </Text>
          <Text
            style={{ fontSize: PDF_FONTS.sizes.small, color: COLORS.textLight }}
          >
            Este documento é confidencial e destinado exclusivamente ao uso
            médico
          </Text>
          <Text
            style={{ fontSize: PDF_FONTS.sizes.small, color: COLORS.textLight }}
          >
            Relatório: {numeroRelatorio} | Página 1 de 1
          </Text>
          <Text style={[styles.dataRelatorio, { marginTop: 10 }]}>
            Gerado em: {dataAtual}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
