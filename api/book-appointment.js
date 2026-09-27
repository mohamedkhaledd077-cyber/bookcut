const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      phone,
      shop_id,
      barber_id,
      service_id,
      appointment_time
    } = req.body;

    if (
      !name ||
      !phone ||
      !shop_id ||
      !barber_id ||
      !service_id ||
      !appointment_time
    ) {
      return res.status(400).json({
        error: "كل البيانات مطلوبة"
      });
    }

    const { data: customer, error: customerError } =
      await supabase
        .from("customers")
        .insert({
          name,
          phone
        })
        .select("id")
        .single();

    if (customerError) {
      return res.status(400).json({
        error: customerError.message
      });
    }

    const { data: appointment, error: appointmentError } =
      await supabase
        .from("appointments")
        .insert({
          customer_id: customer.id,
          shop_id,
          barber_id,
          service_id,
          appointment_time,
          status: "pending"
        })
        .select()
        .single();

    if (appointmentError) {
      return res.status(400).json({
        error: appointmentError.message
      });
    }

    return res.status(200).json({
      success: true,
      appointment
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
