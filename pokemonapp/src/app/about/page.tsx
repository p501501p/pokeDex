import { Box, Button, Card, CardContent, Container, Divider, Link, Paper, Stack, Typography } from "@mui/material";

const developerInfo = [
  { label: "ผู้พัฒนา", value: "นายกิตติศักดิ์ ขันเเข็ง (673450031-4)" },
  { label: "รายวิชา", value: "Front-end Web Programming" },
  { label: "หลักสูตร", value: "วิทยาการคอมพิวเตอร์และสารสนเทศ" },
  { label: "มหาวิทยาลัย", value: "มหาวิทยาลัยขอนแก่น" },
];

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button component="a" href="/" variant="outlined" sx={{ mb: 3, borderRadius: 999 }}>
        ← กลับหน้าแรก
      </Button>

      <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)" }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="overline" sx={{ color: "#2563eb", fontWeight: 700, letterSpacing: 2 }}>
            About this project
          </Typography>
          <Typography variant="h3" sx={{ mt: 1, mb: 2, fontWeight: 700 }}>
            Pokédex Hub
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mb: 3 }}>
            โครงการนี้ถูกสร้างขึ้นเพื่อแสดงข้อมูล Pokémon ครบทั้งการเรียกดูรายชื่อจาก PokeAPI, หน้ารายละเอียดพร้อมวิวัฒนาการและเสียง และการออกแบบเว็บที่ทันสมัยและรองรับอุปกรณ์ต่าง ๆ
          </Typography>

          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                {developerInfo.map((item) => (
                  <Box key={item.label}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { xs: "flex-start", sm: "center" } }}>
            <Typography variant="body1">Source Code:</Typography>
            <Link href="https://github.com/" target="_blank" rel="noreferrer" underline="hover" sx={{ fontWeight: 600 }}>
              GitHub Repository
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
