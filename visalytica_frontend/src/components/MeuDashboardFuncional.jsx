"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export default function MenuDashboardFuncional({
  title,
  data,
  dataKey,
  gradient = false,
  formatter,
  tipoGrafico,
}) {
  //Pega ultimos 6
  const dataFiltrada = data.slice(-6);
  console.log(dataFiltrada);

  return (
    <Card className="flex flex-1 flex-col ">
      <CardHeader className="pb-5 md:pl-14 max-md:text-center">
        <CardDescription className="text-cinza_escuro text-[16px]">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-3/4 max-md:min-h-52">
        <ResponsiveContainer width="100%" height="100%">
          {tipoGrafico == "bar" ? (
            <BarChart
              data={dataFiltrada}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              {gradient && (
                <defs>
                  <linearGradient
                    id="gradienteBarra"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#2A279C" />
                    <stop offset="95%" stopColor="#166DED" />
                  </linearGradient>
                </defs>
              )}

              <XAxis
                dataKey="month"
                stroke="#888"
                className="text-sm"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                className="text-sm"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatter}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
                formatter={formatter}
              />
              <Bar
                dataKey={dataKey}
                fill={gradient ? "url(#gradienteBarra)" : "#716FEA"}
                radius={[6, 6, 6, 6]}
                animationDuration={600}
              />
            </BarChart>
          ) : (
            <LineChart
              data={dataFiltrada}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              {/* O gradiente funciona da mesma forma, mas vamos renomear o ID por clareza */}
              <defs>
                <linearGradient id="gradienteLinha" x1="0" y1="0" x2="1" y2="0">
                  {/* Ajustei o gradiente para ser horizontal (x2="1"), que geralmente fica melhor em linhas */}
                  <stop offset="5%" stopColor="#2A279C" />
                  <stop offset="95%" stopColor="#166DED" />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                stroke="#888"
                className="text-sm"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                className="text-sm"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatter}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  fontSize: "12px",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
                formatter={formatter}
              />

              {/* Componente <Line> no lugar de <Bar> */}
              <Line
                type="monotone" // Deixa a linha curvada e suave
                dataKey={dataKey}
                stroke="#716FEA" // Usamos "stroke" em vez de "fill"
                strokeWidth={3} // Aumenta a espessura da linha
                dot={false} // Remove os pontos em cada dado
                activeDot={{ r: 6 }} // Mostra um ponto maior ao passar o mouse
                animationDuration={600}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
