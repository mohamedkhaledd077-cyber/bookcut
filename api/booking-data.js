const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { data: shops, error: shopsError } =
      await supabase
        .from("barbershops")
        .select("id, name, city")
        .order("name");

    if (shopsError) {
      return res.status(400).json({
        error: shopsError.message
      });
    }

    const { data: barbers, error: barbersError } =
      await supabase
        .from("barbers")
        .select("id, shop_id, name")
        .eq("active", true)
        .order("name");

    if (barbersError) {
      return res.status(400).json({
        error: barbersError.message
      });
    }

    const { data: services, error: servicesError } =
      await supabase
        .from("services")
        .select("id, shop_id, name, price, duration_minutes")
        .eq("active", true)
        .order("name");

    if (servicesError) {
      return res.status(400).json({
        error: servicesError.message
      });
    }

    return res.status(200).json({
      shops,
      barbers,
      services
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
